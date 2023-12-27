import { create } from "domain";
import prisma from "../../../../lib/prismaClient"

export async function PUT(req: Request, res: Response) {
  try {
    const body = await req.json();

    if (!body.id || !body.name) {
      return new Response(
        JSON.stringify({
          message: "Book id and name must be provided",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const existingBook = await prisma.book.findUnique({
      where: { id: body.id },
    });

    if (!existingBook) {
      return new Response(
        JSON.stringify({
          message: "Book not found",
        }),
        {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const updatedBook = await prisma.book.update({
      where: { id: body.id },
      data: {
        name: body.name,
        author: body.author || "A/N",
        isRead: body.isRead || false,
      },
    });

    return new Response(JSON.stringify(updatedBook), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function GET(req: Request, res: Response) {
  try {
    const books = await prisma.book.findMany({
      select: {
        id: true,
        author: true,
        name: true,
        isRead: true,
        createdAt: true
      },
    });
    return new Response(JSON.stringify(books), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error ;)",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function POST(req: Request, res: Response) {
  try {
    const book = await req.json()

    if (!book.name) {
      return new Response(
        JSON.stringify({
          message: "Book name must be filled",
        }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }
    if (!book.author) {
      book.author = "A/N"
    }

    const createBook =  await prisma.book.create({
      data: {
          name: book.name,
          author: book.author,
          isRead: false
      },
    });
    return new Response(JSON.stringify(createBook), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  catch(e) {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(req: Request, res: Response) {
  try {
    const body = await req.json()
    const book = await prisma.book.delete({
      where: { id: body.id}
    });
    return new Response(
      JSON.stringify({
        message: "Book deleted: " + body.id,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  catch {
    return new Response(
      JSON.stringify({
        message: "Internal Server Error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}