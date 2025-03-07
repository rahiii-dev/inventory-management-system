/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export default {
  //user
  UserService: Symbol('UserService'),
  UserController: Symbol('UserController'),
  UserRepository: Symbol('UserRepository'),
  // product
  ProductService: Symbol('ProductService'),
  ProductController: Symbol('ProductController'),
  ProductRepository: Symbol('ProductRepository'),
  // customer
  CustomerService: Symbol('CustomerService'),
  CustomerController: Symbol('CustomerController'),
  CustomerRepository: Symbol('CustomerRepository'),
  // sale
  SaleService: Symbol('SaleService'),
  SaleController: Symbol('SaleController'),
  SaleRepository: Symbol('SaleRepository'),
  // report
  ReportService: Symbol('ReportService'),
  ReportController: Symbol('ReportController'),

  // external
  TokenService: Symbol('TokenService'),
  PDFService: Symbol('PDFService'),
  ExcelService: Symbol('ExcelService'),
  EmailService: Symbol('EmailService'),
};
