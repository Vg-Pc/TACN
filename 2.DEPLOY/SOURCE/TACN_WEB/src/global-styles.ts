import { createGlobalStyle } from 'styled-components'

const Styles = createGlobalStyle`
    .ant-descriptions-item-content,
    .ant-menu-submenu,
    .ant-menu-item,
    .ant-collapse-header,
    .ant-table-thead { 
       font-size: 15px; 
       font-weight:700
       }

    body,
    html,
    a {
        font-family:'Quicksand','Ubuntu', sans-serif;
    }

    .ant-table-expanded-row  .ant-table-cell{
        padding: 0px ;
    }
    body {
        margin:0;
        padding:0;
        border: 0;
        outline: 0;
        background: #eeeeeeee;
        overflow-x: hidden;
    }

    a:hover {
        color: #000;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        font-family:'Quicksand','Ubuntu', sans-serif;
        color: #0a1f44;
        font-size: 2.575rem;
        line-height: 3.0625rem;
        @media only screen and (max-width: 414px) {
          font-size: 1.625rem;
        }
    }

    
   

`

export default Styles
