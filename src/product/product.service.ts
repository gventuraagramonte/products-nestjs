import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  async getProducts(): Promise<Product[]> {
    const allProducts = await this.productModel.find();
    return allProducts;
  }

  async getProduct(productID: string): Promise<Product> {
    const onlyOneProduct = await this.productModel.findById(productID);
    return onlyOneProduct;
  }

  async createProcut(createProductDTO: CreateProductDTO): Promise<Product> {
    const productNew = new this.productModel(createProductDTO);
    await productNew.save();
    return productNew;
  }

  async deleteProduct(productID: string): Promise<Product> {
    const deleteProduct = await this.productModel.findByIdAndDelete(productID);
    return deleteProduct;
  }

  async updateProduct(
    productID: string,
    createProductDTO: CreateProductDTO,
  ): Promise<Product> {
    const updateProduct = await this.productModel.findByIdAndUpdate(
      productID,
      createProductDTO,
      { new: true },
    );
    return updateProduct;
  }
}
