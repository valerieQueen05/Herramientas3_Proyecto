"use client";

import { LuCoffee } from "react-icons/lu";
import { CiCircleCheck } from "react-icons/ci";
import {Button, Description, FieldError, Form, Input, Label, TextField} from "@heroui/react";

export default function Home() {
  <>
    <section>
      <nav>
        <ul>
          <li>Home</li>
          <li>Nosotros</li>
          <li>Contacto</li>
          <li>Ayuda</li>
        </ul>
      </nav>
    </section>
    {/*Fin, Menú de navegación*/}

    {/*Inicio, Tarjetas*/ }
    <section>
      <article>
        <div>
          <img src="https://placehold.co/600x400" alt="Cafe Aroma" />
        </div>
      </article>
      <article>
        <div>
          <h2>Bienvenido a Cafe Aroma</h2>
          <p>Disfruta de nuestros deliciosos cafés y postres.</p>
        </div>
      </article>
    </section>
  </>
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data: Record<string, string> = {};

    // Convert FormData to plain object
    formData.forEach((value, key) => {
      data[key] = value.toString();
    });

    alert(`Form submitted with: ${JSON.stringify(data, null, 2)}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <div className = "flex-col gap-8 rounded-3xl bg-white p-10 shadow-lg items-center " >
        <LuCoffee className="mb-4 text-6xl text-black flex-items-center block mx-auto" />
        <h1 className="mb-4 text-2xl font-bold text-black text-center">Cafe Aroma</h1>
        <h1 className="mb-4 text-lg text-black text-center">Sistema de pedidos onlines</h1>
    <Form
      className="flex w-96 flex-col gap-4 justify-content-center justify-center"
      render={(props) => <form {...props} data-custom="foo" />}
      onSubmit={onSubmit}
    >
      <TextField
        isRequired
        name="email"
        type="email"
        validate={(value) => {
          if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
            return "Please enter a valid email address";
          }

          return null;
        }}
      >
        <Label>Email</Label>
        <Input placeholder="john@example.com" />
        <FieldError />
      </TextField>

      <TextField
        isRequired
        minLength={8}
        name="password"
        type="password"
        validate={(value) => {
          if (value.length < 8) {
            return "Password must be at least 8 characters";
          }
          if (!/[A-Z]/.test(value)) {
            return "Password must contain at least one uppercase letter";
          }
          if (!/[0-9]/.test(value)) {
            return "Password must contain at least one number";
          }

          return null;
        }}
      >
        <Label>Password</Label>
        <Input placeholder="Enter your password" />
        <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
        <FieldError />
      </TextField>

      <div className="flex gap-2">
        <Button type="submit">
          <CiCircleCheck />
          Submit
        </Button>
        <Button type="reset" variant="secondary">
          Reset
        </Button>
      </div>
    </Form>
    </div>
    </div>
  );
}