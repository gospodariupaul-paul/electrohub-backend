@Post('create')
@UseInterceptors(FileInterceptor('image'))
async create(
  @UploadedFile() file: Express.Multer.File,
  @Body()
  body: {
    name: string;
    price: any;
    description: string;
    categoryId: any;
    stock: any; // 🔥 AICI ERA PROBLEMA
  },
) {
  const { name, price, description, categoryId, stock } = body;

  return this.productsService.create({
    name,
    price: Number(price),
    description,
    categoryId: Number(categoryId),
    stock: Number(stock), // 🔥 ACUM E GARANTAT
    image: file,
  });
}
