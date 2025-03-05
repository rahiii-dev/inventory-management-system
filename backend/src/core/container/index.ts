import { Container } from "inversify";
import { loadExternalContainer } from "../../module/external/externa.module";
import { loadUserContainer } from "../../module/user/user.module";
import { loadProductContainer } from "../../module/product/product.module";
import { loadCustomerContainer } from "../../module/customer/customer.module";

const container = new Container();

loadExternalContainer(container);
loadUserContainer(container);
loadProductContainer(container);
loadCustomerContainer(container);

export { container };

