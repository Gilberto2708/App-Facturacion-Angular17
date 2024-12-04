import { Component, EventEmitter, Input, input, OnInit, Output } from '@angular/core';
import { Item } from '../../models/item';
import { CommonModule } from '@angular/common';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent implements OnInit {

  @Input() items: Item[] = [];
  @Output() editItem = new EventEmitter<Item>();

  onEdit(item: Item) {
     this.editItem.emit(item);
  }



  constructor(private invoiceService: InvoiceService) {}
  ngOnInit(): void {
    this.items = this.invoiceService.getInvoice().items;
  }

  getTotalAmount(): number {
    return this.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  }

  deleteItem(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.invoiceService.deleteItemById(id);
        this.items = this.invoiceService.getInvoice().items;
        Swal.fire('Eliminado', 'El ítem ha sido eliminado.', 'success');
      }
    });
  }
}


