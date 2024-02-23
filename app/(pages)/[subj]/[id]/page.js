import Mermaid from "../../../components/Mermaid";
import { buildGraph } from "../../../data/graphBuilder";
import "../../../components/styles/Layout.css";
import "../../../components/styles/GraphPage.css";
import Access, { allSubjects } from "../../../data/access";

import Custom404 from "../../[errors]/404"

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: `${params.subj.toUpperCase()} ${params.id}`,
  };
}

export default function Page({ params }) {
  const SUBJ = params.subj.toUpperCase();
  const ID = params.id.toUpperCase();
  if (!allSubjects.includes(SUBJ)) return <Custom404 />;  // Display 404 page when subject is not available
  if (!Access(SUBJ).ids.includes(ID)) return <Custom404 />; // Display 404 page when id is not available

  const graphString = buildGraph(Access(SUBJ).getCourse(ID, "id").code);

  return (
    <div>
      <h1>
        {SUBJ} {ID}{" "}
        <Mermaid graph={graphString} />
      </h1>
    </div>
  );
}
