/**
 * InversifyJS need to use the type as identifiers at runtime.
 * We use symbols as identifiers but you can also use classes and or string literals.
 */
export default {
  UserService: Symbol('UserService'),
  UserController: Symbol('UserController'),
  UserRepository: Symbol('UserRepository'),
  // product
  ProductService: Symbol('ProductService'),
  ProductController: Symbol('ProductController'),
  ProductRepository: Symbol('ProductRepository'),

  // external
  TokenService: Symbol('TokenService'),
};
