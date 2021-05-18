import styled from 'styled-components'
import { Col, List, Typography } from 'antd'
const { Text } = Typography

export const ListItem = styled(List.Item)`
  cursor: pointer;
  &:hover {
    background: #f0f0f0;
  }
`

export const ColIcon = styled(Col)`
  display: none;
  text-align: end;
  ${ListItem}:hover & {
    display: block;
    cursor: pointer;
  }
`

export const TextTable = styled(Text)`
  font-family: 'Quicksand';
  font-size: 14;
`
