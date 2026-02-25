@Controller('conversations')
export class ConversationController {
  constructor(private service: ConversationService) {}

  @Post()
  create(@Body() body: any) {
    return this.service.createConversation(
      body.buyerId,
      body.sellerId,
      body.productId,
    );
  }

  // 🔥 EXISTENT — caută conversația după buyer + product
  @Get()
  get(@Query() query: any) {
    return this.service.getConversation(
      Number(query.buyerId),
      Number(query.productId),
    );
  }

  // 🔥 NOU — exact ce îți trebuie pentru frontend
  @Get(':id')
  getById(@Param('id') id: string) {
    return this.service.getConversationById(Number(id));
  }
}
