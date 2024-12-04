import { Invoice } from "../models/invoice";

export const invoiceData: Invoice = {
  id: 1,
  name: 'Componentes de PC',
  client: {
    id: 1,
    name: 'Gilberto',
    lastname: 'Cabrera',
    adress: [
      {
        id: 1,
        country: 'USA',
        city: 'Los angeles',
        street: 'street',
        zipCode: '21345'
      }
    ]
  },
  company: {
    id: 1,
    name: 'Cobe73',
    fiscalNumber: 323423423
  },
  items: [
    {
      id: 1,
      product: 'producto 01',
      price: 1,
      quantity: 1
    },
    {
      id: 2,
      product: 'producto 02',
      price: 2,
      quantity: 2
    }  ,
    {
      id: 3,
      product: 'producto 03',
      price: 3,
      quantity: 3
    }
  ]
}
