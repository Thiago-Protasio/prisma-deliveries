import { Clients } from "@prisma/client";
import { hash } from "bcrypt";
import { prisma } from "../../../../database/prismaClient";

interface ICreateClient {
  username: string;
  password: string;
}

export class CreateClientUseCase {
  async execute({ username, password }: ICreateClient): Promise<Clients> {
    // Validar se o usuário existe
    const clientExists = await prisma.clients.findFirst({
      where: {
        username: {
          equals: username,
          mode: "insensitive"
        }
      }
    })

    if (clientExists) {
      throw new Error("Client already exists")
    }

    // Criptografar a senha
    const hashPassword = await hash(password, 10);

    // Salvar o client

    const client = await prisma.clients.create({
      data: {
        username,
        password: hashPassword
      }
    })

    return client
  }
}