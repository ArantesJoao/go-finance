import React, { useState } from "react";
import { Alert, Keyboard, Modal, TouchableWithoutFeedback } from "react-native";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

import { Button } from "../../components/Form/Button";
import { InputForm } from "../../components/Form/InputForm";
import { Input } from "../../components/Form/Input";
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

  function handleRegister(form: Partial<FormData>) {
    if (!transactionType) return Alert.alert("Selecione o tipo da transação!");

    if (category.key === "category")
      return Alert.alert("Selecione a categoria!");

    const data = {
      name: form.name,
      value: form.value,
      transactionType,
      category: category.key,
    };
    console.log(data);
  }

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
