import React from "react";
import { exp } from "react-native-reanimated";

import { Container } from "./styles";

export function TransactionCard() {
  return (
    <Container>
      <Title>Desenvolvimento de site</Title>

      <Amount>R$ 12.000,00</Amount>

      <Footer>
        <Category>
          <Icon />
          <CategoryName>Vendas</CategoryName>
        </Category>
      </Footer>
    </Container>
  );
}
