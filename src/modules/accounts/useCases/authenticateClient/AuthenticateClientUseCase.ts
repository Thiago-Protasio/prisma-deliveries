import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../../database/prismaClient";

interface IAuthenticateClient {
  username: string;
  password: string;
}

export class AuthenticateClientUseCase {
  async execute({ username, password }: IAuthenticateClient): Promise<string> {
    // Verifcar um username de cadastro
    const client = await prisma.clients.findFirst({
      where: {
        username
      }
    })

    if (!client) {
      throw new Error("Username or password invalid!")
    }
    // Verificar se senha corresponde ao username
    const passwordMatch = await compare(password, client.password);

    if (!passwordMatch) {
      throw new Error("Username or password invalid!")
    }

    // Gerar token
    const token = sign({ username }, "8c031252e504c3eb377a39826c14e5a7", {
      subject: client.id,
      expiresIn: "1d"
    })

    return token
  }
}