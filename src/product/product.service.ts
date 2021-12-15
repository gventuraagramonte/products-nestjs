import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Product } from './interfaces/product.interface';
import { CreateProductDTO } from './dto/product.dto';
const sslCertificate = require('get-ssl-certificate');
const request = require('request');
const assert = require('assert');
const axios = require('axios');
@Injectable()
export class ProductService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  daysDiffInDays(a, b) {
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
  }

  async getProducts(): Promise<Product[]> {
    let allProducts = await this.productModel.find();
    let products = allProducts;
    for (let i = 0; i < allProducts.length; i++) {
      let data = allProducts[i].dateDomain;
      let url = allProducts[i].name;
      let application = allProducts[i].description;
      let area = allProducts[i].imageURL;
      let data1 = data.toString();
      let currentDate = new Date();
      let domainExpirationDate = new Date(data1);
      let dd = this.daysDiffInDays(currentDate, domainExpirationDate);
      let datoIssuer, certValidfrom, certValidTo;
      console.log('Fecha de dominio: ', url);
      products[i].daysExp = dd.toString();
      sslCertificate
        .get(url)
        .then(function(certificate) {
          datoIssuer = certificate.issuer.CN;
          certValidTo = certificate.valid_to;
          certValidfrom = certificate.valid_from;
          let today = new Date();
          let certValidToDate = new Date(certValidTo);
          // Funcion para calcular los dias restantes
          function daysDiff(a, b) {
            const _MS_PER_DAY = 1000 * 60 * 60 * 24;
            const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
            const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

            return Math.floor((utc2 - utc1) / _MS_PER_DAY);
          }
          let daysCert = daysDiff(today, certValidToDate);
          // Aqui entra la función de enviar datos a New Relic

          function ejecutarAxios(b, c, d, e, f, g, h) {
            axios({
              method: 'post',
              url:
                'https://insights-collector.newrelic.com/v1/accounts/2662887/events',
              headers: {
                'Content-Type': 'application/json',
                'X-Insert-Key': process.env.LICENCE_KEY,
              },
              data: {
                eventType: 'DomainCertificate',
                Url: b,
                Issuer: c,
                Aplication: d,
                Area: e,
                DaysToExpirationDomain: f,
                DaysToExpiration: g,
                ExpirationDate: h,
              },
            });
          }

          ejecutarAxios(
            url,
            datoIssuer,
            application,
            area,
            dd,
            daysCert,
            certValidToDate,
          );

          //////////////////////////////////////////////////
        })
        .catch(e => {
          console.log('No hay información disponible del certificado');
        });
    }
    return products;
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
