import React from "react";
import { Button } from "../../components/Form/Button";

import { Input } from "../../components/Form/Input";

import { Container, Fields, Form, Header, Title } from "./styles";

export function Register() {
  return (
    <Container>
      <Header>
        <Title>Cadastro</Title>
      </Header>

      <Form>
        <Fields>
          <Input placeholder="Nome" />
          <Input placeholder="Valor" />
        </Fields>
        <Button title="Enviar" />
      </Form>
    </Container>
  );
}
