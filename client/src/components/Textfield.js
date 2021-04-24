import styled from "styled-components";

const TextField = styled.input`
  box-shadow: 0 10px 70px rgba(0, 0, 0, 0.1);
  border: 0;
  border-bottom: 1px solid #aaa;
  font-size: 13pt;
  margin: 4px 0 24px;
  outline: 0;
  padding: 12px;
  width: 280px;

  &:focus {
    border-bottom: 1px solid #000;
  }
`;

export default TextField;
