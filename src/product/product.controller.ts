import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Res,
  HttpStatus,
  Body,
  Param,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/product.dto';
import { ProductService } from './product.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  @Get()
  async allProduct(@Res() res) {
    const products = await this.productService.getProducts();
    res.status(HttpStatus.OK).json({
      message: 'All products',
      products,
    });
  }

  @Get('/:productID')
  async getProduct(@Res() res, @Param('productID') productID) {
    const product = await this.productService.getProduct(productID);
    if (!product) {
      throw new NotFoundException("Product doesn't exist");
    }
    return res.status(HttpStatus.OK).json(product);
  }

  @Post('/create')
  @ApiOperation({ description: 'This endpoint create a product' })
  async createProduct(@Res() res, @Body() createProductDTO: CreateProductDTO) {
    const product = await this.productService.createProcut(createProductDTO);
    res.status(HttpStatus.OK).json({
      message: 'Product successfully created',
      product,
    });
  }

  @Put('/update')
  async updateProduct(
    @Res() res,
    @Body() createProductDTO: CreateProductDTO,
    @Query('productID') productID,
  ) {
    const updatedProduct = await this.productService.updateProduct(
      productID,
      createProductDTO,
    );
    if (!updatedProduct) {
      throw new NotFoundException("Product doesn't exist");
    }
    return res.status(HttpStatus.OK).json({
      message: 'Product updated successfully',
      updatedProduct,
    });
  }

  @Delete('/delete/:productID')
  async deleteProduct(@Res() res, @Param('productID') productID) {
    const productDelete = await this.productService.deleteProduct(productID);
    if (!productDelete) {
      throw new NotFoundException("Product doesn't exist");
    }
    res.status(HttpStatus.OK).json({
      message: 'Product deleted',
    });
  }
}
