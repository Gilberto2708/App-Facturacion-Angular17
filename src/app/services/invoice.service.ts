import { Injectable } from '@angular/core';
import { invoiceData } from '../data/invoice.data';
import { Invoice } from '../models/invoice';
import { Item } from '../models/item';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  updateItem(updatedItem: Item): void {
    const index = this.invoice.items.findIndex(item => item.id === updatedItem.id);
    if (index !== -1) {
      this.invoice.items[index] = { ...updatedItem };
    }
  }

  private invoice: Invoice = invoiceData;

  constructor() {}

  getInvoice(): Invoice {
    return this.invoice;
  }

  deleteItemById(id: number): void {
    this.invoice.items = this.invoice.items.filter((item) => item.id !== id);
  }

  saveItem(item: Item): void {
    this.invoice.items.push(item);
  }
}
