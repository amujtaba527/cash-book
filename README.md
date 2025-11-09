# Cash Book

A responsive web application to track cash inflow and outflow, providing a clear summary and transaction history. Data is persisted in the browser's local storage.

## Features

- **Add Transactions:** Easily add new cash in and cash out transactions.
- **Transaction List:** View a history of all transactions, sorted by date.
- **Summaries:** See a summary of total cash in, total cash out, and the current balance.
- **Category Breakdown:** View a summary of transactions by category.
- **Filter Transactions:** Filter transactions by type (cash in/out) and date range.
- **PWA:** The application can be installed as a Progressive Web App (PWA).
- **Responsive Design:** The application is designed to work on all screen sizes.
- **Local Storage:** All data is persisted in the browser's local storage.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start by adding a new transaction using the '+' button.

## Tech Stack

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## Project Structure

- `app/`: Contains the main application logic and UI.
- `components/`: Contains the reusable React components.
- `utils/`: Contains the TypeScript types.
- `public/`: Contains the static assets.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](httpshttps://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
