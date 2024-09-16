// page with dynamic graph generation and search bar for courses in [subj]
import { Access, allSubjects } from "../../data/access";
import { NavigationSearch } from "../../components/search/NavigationSearch";

import Custom404 from "../[errors]/404";
import { Search } from "../../data/search";
import { CoursesTable } from "../../components/table/CoursesTable";

import "../../components/styles/SearchBarSmall.css"
import "../../components/styles/SubjPage.css"

export async function generateMetadata({ params, searchParams }, parent) {
  return {
    title: `${params.subj.toUpperCase()} Courses`,
  };
}

export default function Page({ params }) {
  const SUBJ = params.subj.toUpperCase();
  if (!allSubjects.includes(SUBJ)) return <Custom404 />; // Display 404 page when subject is not available
  const SUBJ_COURSES = Access(SUBJ).courses;

  return (
    <div id="content">
      <h1>{Search().exactDept(SUBJ).toUpperCase()}</h1>
      <div id="navSmall">
        <NavigationSearch/>
      </div>
      <div id="tableBox">
        <CoursesTable courses={SUBJ_COURSES}/>
      </div>
    </div>
  );
}
