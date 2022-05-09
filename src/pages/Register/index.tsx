import React, { useState, useEffect } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

import { useForm } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";

import { Button } from "../../components/Form/Button";
import { InputForm } from "../../components/Form/InputForm";
import { TransactionTypeButton } from "../../components/Form/TranscationTypeButton";
import { CategorySelectButton } from "../../components/Form/CategorySelectButton";

import { CategorySelect } from "../CategorySelect";

import {
  Container,
  Fields,
  Form,
  Header,
  Title,
  TransactionTypes,
} from "./styles";

interface FormData {
  name: string;
  value: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required("O nome é obrigatório!"),
  value: Yup.number()
    .transform((_value, originalValue) =>
      Number(originalValue.replace(/,/, "."))
    )
    .typeError("Informe um valor numérico!")
    .positive("O valor não pode ser negativo!"),
});

const dataKey = "@gofinance:transactions";

export function Register() {
  const [transactionType, setTransactionType] = useState("");
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [category, setCategory] = useState({
    key: "category",
    name: "Categoria",
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  function handleTransactionTypeSelect(type: "income" | "outcome") {
    setTransactionType(type);
  }

  function handleCloseCategoryModal() {
    setCategoryModalOpen(false);
  }

  function handleOpenCategoryModal() {
    setCategoryModalOpen(true);
  }

  async function handleRegister(form: Partial<FormData>) {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação!");

    if (category.key === "category")
      return Alert.alert("Selecione a categoria!");

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      value: form.value,
      transactionType,
      category: category.key,
      date: new Date(),
    };

    try {
      // Formatting data to save
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const formattedData = [...currentData, newTransaction];

      // Saving asynchronously
      await AsyncStorage.setItem(dataKey, JSON.stringify(formattedData));

      // Clearing fields after logging
      reset();
      setTransactionType("");
      setCategory({
        key: "category",
        name: "Categoria",
      });
    } catch (error) {
      console.log(error);
      Alert.alert("Não foi possível salvar!");
    }
  }

  useEffect(() => {
    async function loadData() {
      // useEffect can't be async
      const data = await AsyncStorage.getItem(dataKey);
      console.log(JSON.parse(data!));
    }

    loadData();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>Cadastro</Title>
        </Header>

        <Form>
          <Fields>
            <InputForm
              name="name"
              control={control}
              placeholder="Nome"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm
              name="value"
              control={control}
              placeholder="Valor"
              keyboardType="numeric"
              error={errors.value && errors.value.message}
            />
            <TransactionTypes>
              <TransactionTypeButton
                title="Income"
                type="income"
                onPress={() => handleTransactionTypeSelect("income")}
                isActive={transactionType === "income"}
              />
              <TransactionTypeButton
                title="Outcome"
                type="outcome"
                onPress={() => handleTransactionTypeSelect("outcome")}
                isActive={transactionType === "outcome"}
              />
            </TransactionTypes>
            <CategorySelectButton
              title={category.name}
              onPress={handleOpenCategoryModal}
            />
          </Fields>
          <Button title="Enviar" onPress={handleSubmit(handleRegister)} />
        </Form>
        <Modal visible={categoryModalOpen}>
          <CategorySelect
            category={category}
            setCategory={setCategory}
            closeSelectCategory={handleCloseCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}
