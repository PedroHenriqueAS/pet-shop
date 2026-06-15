type Props = {
  title: string;
};

const Component = ({ title }: Props) => {
  return (
    <>
      <h2>Component</h2>
    </>
  );
};
export default function Home() {
  return (
    <div>
      <h1>rodando</h1>
      <Component title={1} />
    </div>
  );
}
