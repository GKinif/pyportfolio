import {json, useLoaderData, LoaderFunction} from "remix";
import {Table, Text, Title} from "@mantine/core";
import {ApiBudget, getBudget} from "~/services/budgets";

const dateFormatter = new Intl.DateTimeFormat('default', {year: 'numeric', month: 'short', day: 'numeric'});
const formatDate = (date: Date) => {
  if (!date || Object.prototype.toString.call(date) !== '[object Date]') {
    return '';
  }
  return dateFormatter.format(date);
}

export const loader: LoaderFunction = async ({params}) => {
  const snippet = await getBudget(params.id ?? "");

  return json(snippet.data);
};

export default function Snippet() {
  const data = useLoaderData<ApiBudget>();
  console.log('budget: ', data)

  return (
    <main>
      <Title order={1}>{data.title}</Title>

      <Text>{data.description}</Text>

      <Table striped highlightOnHover>
        <thead>
        <tr>
          <th>Date</th>
          <th>Category</th>
          <th>Amount</th>
          <th>Name</th>
        </tr>
        </thead>

        <tbody>
        {data.entries?.map(entry => (
          <tr key={entry.id}>
            <td>{formatDate(new Date(entry.date))}</td>
            <td>{entry.category}</td>
            <td>{entry.amount}€</td>
            <td>{entry.description}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </main>
  );
}
