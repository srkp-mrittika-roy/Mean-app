import { Component, OnInit ,inject,EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../cart.service';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';



interface CartData {
  _id: string;
  productName: string;
  productType: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,FooterComponent,HeaderComponent],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  httpclient = inject(HttpClient);
  cartTotal: number = 0;
  productsData: any = [];
  productQuantities: { [productId: string]: number } = {};
  totalPrice?: number;
  quantityUpdated?: boolean;
  cartItems: any[] = [];






  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cartService : CartService

  ) { 
    this.cartItems = this.cartService.getCartItems();

  }

  ngOnInit(): void {
    
    this.fetchData();

  }



  fetchData(): void {
    this.httpclient.get<any[]>('http://localhost:3000/cart')
      .subscribe({
        next: (data) => {
          console.log(data);
          const allProducts = data.flatMap(cartItem => cartItem.products);
          console.log(allProducts);

          this.productsData = allProducts.map(item => ({
            product: item.product,
            quantity: item.quantity,
            totalValue: item.quantity * item.product.price 
          }));
          
        },
        error: (error) => {
          console.error('Error fetching cart data:', error);
        }
      });
}



  // removeFromCart(productId: any): void {
  //   if (!productId) {
  //     console.error('Product ID is undefined');
  //     return;
  //   }
  //   this.httpclient.delete('http://localhost:3000/cart/delete/' + productId)
  //     .subscribe(
  //       (response) => {
  //         console.log(response);
  //         this.fetchData(); 
  //       });

  // }
  removeFromCart(productId: any): void {
    if (!productId) {
      console.error('Product ID is undefined');
      return;
    }
    this.httpclient.delete('http://localhost:3000/cart/delete/' + productId)
      .subscribe({
        next: () => {
        
          this.productsData = this.productsData.filter((item:any) => item.product._id !== productId);
        },
        error: (error) => {
          console.error('Error removing product from cart:', error);
        }
      });
  }
  
  

  increaseQuantity(productId: string, quantity: number): void {
    const updatedQuantity = quantity + 1;
    this.updateQuantityOnBackend(productId, updatedQuantity);
}

  decreaseQuantity(productId: string, quantity: number): void {
    if (quantity > 1) {
        const updatedQuantity = quantity - 1;
        this.updateQuantityOnBackend(productId, updatedQuantity);
    }
}


updateQuantityOnBackend(productId: string, quantity: number): void {
  this.httpclient.put<any>(`http://localhost:3000/cart/update/${productId}`, { quantity })
      
      .subscribe({
        next: (response) => {
          
        console.log('Quantity updated successfully:', response);  
          this.fetchData();
        },
        error: (error) => {
              console.error('Error updating quantity:', error);
    }
      });
}
  
  

  updateProductTotalPrice(productId: string): void {
    // const product = this.productsData.find((p: any) => p._id === productId);
    // if (product) {
    //   product.totalPrice = product.price * this.productQuantities[productId];
    //   console.log(`Total price for product ${productId}: ${product.totalPrice}`);
    // }
  }

  setQuantityUpdated(productId: string, value: boolean): void {
    // const product = this.productsData.find((p:any) => p._id === productId);
    // if (product) {
    //   product.quantityUpdated = value; 
    // }
  }

  goToCheckout(): void {
    // this.productsData.forEach((product: any) => {
    //   product.totalPrice = product.price * (this.productQuantities[product._id] || 1);
    // });
    // this.router.navigate(['/check-out'], {
    //   queryParams: {
    //     items: JSON.stringify(this.productsData),
    //     quantities: JSON.stringify(this.productQuantities),
        
    //   }
    // });
  }

 
  
 


  


  calculateCartTotal(): void {
    this.cartTotal = this.productsData.reduce((total: number, product: any) => {
      return total + (product.totalPrice || product.price); // Add total price or default to product price
    }, 0);
    console.log('Total cart price:', this.cartTotal);
  }
  
  
  
  
  
  
}
