import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item } from '../../models/item';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'form-item',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-item.component.html',
})
export class FormItemComponent {
  @Input() items: Item[] = [];
  @Output() onSubmit = new EventEmitter<Item>();
  @Output() onCancel = new EventEmitter<void>();

  @Input() set itemToEdit(item: Item | null) {
    if (item) {
      this.editingItem = item;
      this.isEditing = true;
      this.itemForm.patchValue({
        product: item.product,
        price: item.price,
        quantity: item.quantity
      });
    } else {
      // Si no hay item, reseteamos el formulario
      this.resetForm();
    }
  }

  itemForm: FormGroup;
  isEditing = false;
  private editingItem: Item | null = null;

  constructor(private fb: FormBuilder, private invoiceService: InvoiceService) {
    this.itemForm = this.fb.group({
      product: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  addItem(): void {
    if (this.itemForm.valid) {
      const formValue = this.itemForm.value;

      if (this.isEditing && this.editingItem) {
        // Actualizamos el item existente
        const updatedItem: Item = {
          ...this.editingItem,
          ...formValue
        };
        this.invoiceService.updateItem(updatedItem);
        this.onSubmit.emit(updatedItem);
      } else {
        // Creamos un nuevo item
        const newItem: Item = {
          id: this.items.length + 1,
          ...formValue,
        };
        this.invoiceService.saveItem(newItem);
        this.onSubmit.emit(newItem);
      }
    }
  }

  cancelForm() {
    this.resetForm();
    this.onCancel.emit();
  }

  private resetForm() {
    this.itemForm.reset();
    this.itemForm.patchValue({ price: 0, quantity: 1,product: ''  });
    this.isEditing = false;
    this.editingItem = null;
  }
}
