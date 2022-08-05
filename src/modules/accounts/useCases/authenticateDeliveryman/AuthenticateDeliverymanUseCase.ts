import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../../database/prismaClient";

interface IAuthenticateDeliveryman {
  username: string;
  password: string;
}

export class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: IAuthenticateDeliveryman): Promise<string> {
    // Verifcar um username de cadastro
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username
      }
    })

    if (!deliveryman) {
      throw new Error("Username or password invalid!")
    }
    // Verificar se senha corresponde ao username
    const passwordMatch = await compare(password, deliveryman.password);

    if (!passwordMatch) {
      throw new Error("Username or password invalid!")
    }

    // Gerar token
    const token = sign({ username }, "8c031252e504c3eb355a39826c14e5a7", {
      subject: deliveryman.id,
      expiresIn: "1d"
    })

    return token
  }
}