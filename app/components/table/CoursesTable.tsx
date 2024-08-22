"use client";

import { useState } from "react";
import { Course } from "../../data/types";
import Graph, { build_options, display_options } from "../graph/Graph";
import Link from "next/link";

import "../styles/CoursesTable.css";

import { MdOpenInNew } from "react-icons/md";

export { CoursesTable };

function CoursesTable({ SUBJ_COURSES }: { SUBJ_COURSES: Course[] }) {
  let build: build_options = {
    simplify: false, // set true to remove or/and distinction
    decimate_orphans: true,
  };
  let display: display_options = {
    orientation: "TB",
  };
  // no courses initially selected
  const [selection, setSelection] = useState<Course[]>([]);

  return (
    <div id="containers">
      <div id="coursesTable">{formatTable()}</div>
      <div id="courseBox">
        {selection[0] ? (
          // when at least one course is selected
          <div id="infoBox">
            <div id="infoBoxHead">
              <h2>
                {selection[0].code}
                <br />
                {selection[0].title}
              </h2>
              <Link href={`/${selection[0].subject}/${selection[0].id}`}>
                <button id="openId">
                  <MdOpenInNew />
                </button>
              </Link>
            </div>
            <p>{selection[0].info}</p>
          </div>
        ) : (
          <div id="infoBox">
            <p>
              Please click on a course to add it to the graph. You may click
              multiple courses to display their prerequisites together. To
              remove a course from the graph, click it again.
            </p>
          </div>
        )}
        <div id="graphBox">
          <Graph
            build={{
              includes: selection,
              ...build,
              strong_orphans: selection,
            }}
            display={display}
          />
        </div>
      </div>
    </div>
  );

  function handleClickCard(course: Course) {
    console.log("clicked " + course.code);
    // toggle select functionality
    if (selection.some((c) => c.code == course.code)) {
      // set to new array including all other elements but course
      setSelection(selection.filter((c) => c.code !== course.code));
    } else {
      // new array including all elements and also course
      setSelection([course, ...selection]);
    }
  }

  function formatCard(course: Course) {
    return (
      <button className="card" onClick={() => handleClickCard(course)}>
        {course.id}
      </button>
    );
  }

  function formatTable() {
    return SUBJ_COURSES.map((course, index) => (
      <div key={index}>{formatCard(course)}</div>
    ));
  }
}
