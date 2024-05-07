import { Component ,OnInit , CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';


interface Product {
  _id: string;
  productName: string;
  productType: string;
  price: number;
  description: string;
  imageUrl: string;
  available: boolean;
}


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent,FooterComponent,CommonModule,HttpClientModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  schemas : [CUSTOM_ELEMENTS_SCHEMA]

})
export class HomeComponent implements OnInit{
  data : Product[] = [];



  constructor(private httpclient: HttpClient
  ) {}

  ngOnInit(): void {
      this.fetchData()
  }

  fetchData(){
    this.httpclient
    .get('http://localhost:3000/products')
     .subscribe((data:any)=>{
      this.data = data ;
     })
  }
}
