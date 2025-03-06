import { Container } from "inversify";
import { loadExternalContainer } from "../../module/external/external.module";
import { loadUserContainer } from "../../module/user/user.module";
import { loadProductContainer } from "../../module/product/product.module";
import { loadCustomerContainer } from "../../module/customer/customer.module";
import { loadSaleContainer } from "../../module/sales/sale.module";
import { loadReportContainer } from "../../module/report/report.module";

const container = new Container();

loadExternalContainer(container);
loadUserContainer(container);
loadProductContainer(container);
loadCustomerContainer(container);
loadSaleContainer(container);
loadReportContainer(container);

export { container };

