import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  const result = await prisma.user.findMany();
  res.json(result);
});

app.post("/signup", async (req, res) => {
  const { name, email } = req.body;
  const result = await prisma.user.create({
    data: {
      name,
      email
    }
  })
  res.json(result);
});

app.post("/post", async (req, res) => {
  const { title, content, autherEmail } = req.body;
  const result = await prisma.post.create({
    data: {
      title,
      content,
      auther : {
        connect: {
          email: autherEmail
        }
      }
    }
  })

  res.json(result);
});


app.put("/post/:id/views", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      viewCount: {
        increment: 1
      }
    }
  })
  res.json(result);
});

app.put("/post/:id/publish", async (req, res) => {
  const { id } = req.params;
  const result = await prisma.post.update({
    where: {
      id: Number(id),
    },
    data: {
      published: true
    }
  })
  res.json(result);
});

app.get("/user/:id/draft",async (req, res) => {
  const { id } = req.params;
  const result = await prisma.user.findUnique({
    where: {
      id: Number(id),
    }
  }).posts({
    where: {
      published: false,
    }
  });

  res.json(result);
});


// 指定したidと一致するPOSTを取得
app.get("/post/:id",async (req, res) => {
  const { id } = req.params;
  const result = await prisma.post.findUnique({
    where: {
      id: Number(id),
    },
    select: {
      id: true,
      title: true,
      content: true,
      published: true,
      viewCount: true,
      auther: true,
    }
  });
  res.json(result);
});

// 公開されているすべてのPOSTを取得し、検索文字列がタイトルやコンテンツに含まれているかどうかをチェックしてページネーションやフィルタリングを行う



app.listen(3000, () =>
  console.log(`🚀 Server ready at: http://localhost:3000`)
);