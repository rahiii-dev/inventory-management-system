import { Container } from "inversify";
import TYPES from "../../core/container/container.types";
import { TokenService } from "./token/token.service";
import { ITokenService } from "./token/token.service.interface";

export function loadExternalContainer(container: Container) {
    container.bind<ITokenService>(TYPES.TokenService).to(TokenService);
}