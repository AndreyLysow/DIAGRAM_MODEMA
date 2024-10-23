import dynamic from 'next/dynamic';
const Diagram = dynamic(() => import('../components/app'), { ssr: false });


export default function Home() {
  return (
    <div>
      <Diagram />
    </div>
  );
}
