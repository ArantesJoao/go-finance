import styled, { css } from "styled-components/native";
import { RectButton } from "react-native-gesture-handler";
import { Feather } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

interface ContainerProps {
  isActive: boolean;
  type: "income" | "outcome";
}

interface IconProps {
  type: "income" | "outcome";
}

export const Container = styled.View<ContainerProps>`
  width: 48%;
  border-width: ${({ isActive, type }) => (isActive ? 0 : 1.5)}px;
  border-style: solid;
  border-color: ${({ theme }) => theme.colors.text};
  border-radius: 5px;
  ${({ isActive, type }) =>
    isActive &&
    type === "income" &&
    css`
      background-color: ${({ theme }) => theme.colors.success_light};
    `};
  ${({ isActive, type }) =>
    isActive &&
    type === "outcome" &&
    css`
      background-color: ${({ theme }) => theme.colors.attention_light};
    `};
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: ${RFValue(16)}px;
`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: ${RFValue(12)}px;

  color: ${({ theme, type }) =>
    type === "income" ? theme.colors.success : theme.colors.attention};
`;

export const Title = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
`;
