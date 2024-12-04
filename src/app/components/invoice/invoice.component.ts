import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice';
import { CommonModule } from '@angular/common';
import { InvoiceListComponent } from '../invoice-list/invoice-list.component';
import { FormItemComponent } from '../form-item/form-item.component';
import { Item } from '../../models/item';

// Creamos una interfaz para el Modal de Bootstrap
declare var bootstrap: any;

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, InvoiceListComponent, FormItemComponent],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {
  items: Item[] = [];
  invoice!: Invoice;
  private modalInstance: any;
  private isBrowser: boolean;
  selectedItem: Item | null = null; // Añade esta línea

  isEditing: boolean = false; // Añadimos esta propiedad

  constructor(
    private invoiceService: InvoiceService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.invoice = this.invoiceService.getInvoice();

    // Solo inicializamos el modal si estamos en el navegador
    if (this.isBrowser) {
      this.initModal();
    }
  }

  // Añade este método para abrir el modal de nuevo item
  onOpenAddModal() {
    this.selectedItem = null;
    this.isEditing = false;
  }



  private initModal(): void {
    // Esperamos a que el DOM esté listo
    setTimeout(() => {
      const modalElement = document.getElementById('addItemModal');
      if (modalElement) {
        this.modalInstance = new bootstrap.Modal(modalElement);
      }
    });
  }

  private hideModal(): void {
    if (this.isBrowser && this.modalInstance) {
      this.modalInstance.hide();
    }
  }

  async onAddItem(item: Item): Promise<void> {
    try {
      if (!item || !item.price) {
        throw new Error('El ítem debe tener un precio válido');
      }

      const newItem = {
        ...item,
        id: this.items.length + 1,
      };

      this.items.push(newItem);
      this.hideModal();
      this.selectedItem = item;
      this.isEditing = false; // Activamos modo edición
    } catch (error) {
      console.error('Error al agregar ítem:', error);
    }
  }

  onCancelModal(): void {
    this.hideModal();
  }

  ngOnDestroy(): void {
    if (this.isBrowser && this.modalInstance) {
      this.modalInstance.dispose();
    }
  }

  onEditItem(item: Item) {
    this.selectedItem = { ...item };
    this.isEditing = true;
  }

  onUpdateItem(updatedItem: Item) {
    if (this.selectedItem) {
      // Actualizamos el item en el servicio
      this.invoiceService.updateItem(updatedItem);

      // Actualizamos la lista local
      const index = this.items.findIndex((item) => item.id === updatedItem.id);
      if (index !== -1) {
        this.items[index] = { ...updatedItem };
      }

      // Limpiamos el estado
      this.selectedItem = null;
      this.isEditing = false;

      // Cerramos el modal
      this.hideModal();
    }
  }
}
