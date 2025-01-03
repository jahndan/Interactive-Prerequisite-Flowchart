/**
 * Everything in this module is meant to be readonly.
 * Some items are not explicitly marked as such because the
 * LSP struggles to parse large files.
 * @module access
 */

// TODO probably needs further refactor for use in API route handlers

/* TODO docs */
export {
  /** main access functions */
  uid_get,
  course_get,
  is_prereq,
  targets,
  prereqs,

  /** utility functions */
  PrerequisiteTraversal,

  /** readonly consts for validation purposes */
  subject_names,
  subjects,
  numbers,

  /** readonly objects/arrays for iterating over all courses -- avoid if possible */
  maps,
  general,
  honors,

  /** strongly deprecated, preserved for legacy/prototypes */
  Accessor,
};

import { PrerequisiteRule, Course, isAndRule, isOrRule } from "@/data/types";

// import from trusted data source: the repository itself
import _general from "@/data/UMNTC/Courses/general.json";
import _honors from "@/data/UMNTC/Courses/honors.json";
import maps from "@/data/UMNTC/Courses/subjectUidMaps.json";
import _subjectNames from "@/data/UMNTC/allSubjects.json";

const general = _general as { [uid: string]: Course };
const honors = _honors as { [uid: string]: Course };
const subject_names = _subjectNames as { [subjcode: string]: string };
const subjects: readonly string[] = Object.keys(maps);
const numbers: readonly string[] = Object.values(maps).flatMap((m) =>
  Object.keys(m),
);
// maps: (subject: string) --> UidMap
/** course "number" indexes to course "uid" */
type UidMap = { [number: string]: string };

function uid_get(uid: string, honor?: boolean): Course | null;
function uid_get(uids: string[], honor?: boolean): Course[] | null;
function uid_get(uids: string | string[], honor?: boolean) {
  const lambda = honor
    ? (uid: string) => honors[uid] || general[uid] || null
    : (uid: string) => general[uid] || null;
  return Array.isArray(uids) ? uids.map(lambda) : lambda(uids);
}

function course_get(subj: string, num: string, honor?: boolean): Course | null {
  const subjmap: UidMap = maps[subj.toUpperCase()];
  if (!subjmap) {
    return null;
  }
  const uid = subjmap[num];
  return uid_get(uid, honor);
}

function is_prereq(start: Course, end: Course, honor?: boolean): boolean {
  return PrerequisiteTraversal(
    (bools: boolean[]) => bools.some((t) => t === true),
    (a, b: string) => a.uid === b, // string equality to compare uids
    (arg: boolean) => arg, // do nothing
    (arg: boolean) => arg, // do nothing
    false,
    honor,
  )(end.prereq, start.uid);
}

/**
 * TODO test speed - this is potentially really slow
 * -- may be worthwhile to generate target lists offline
 */
function targets(start: Course, honor?: boolean) {
  const courses = honor ? honors : general;
  return Object.values(courses).filter((target) => is_prereq(start, target));
}

function prereqs(start: Course, honor?: boolean) {
  const out: Course[] = [];
  // construct and immediately invoke this function
  PrerequisiteTraversal(
    // traverse and push every course found
    () => {}, // do nothing
    (a, b: Course[]) => b.push(a),
    () => {}, // do nothing
    () => {}, // do nothing
    undefined,
    honor,
  )(start.prereq, out); // to mutate our array
  return out;
}

/** "a little bit of functional programming never hurt anybody" - jahndan, 2024
 *
 * if you're using this, you probably wrote this monstrosity */
function PrerequisiteTraversal<out, state>(
  // output processors for each branch
  arrl: (cl_outs: out[]) => out, // how to combine array of outputs
  crsl: (crs: Course, state_var: state) => out, // what kind of output to derive from a course
  orl: (al_out: out) => out, // any extra process on array-combined output
  andl: (al_out: out) => out, // any extra process on array-combined output
  // what default to use for empty object
  empty_default: out,
  // whether or not to use the honors prerequisites or general ones
  honor_reqs?: boolean,
  // state mutators for each branch if necessary
  arrx?: (x: state, index: number) => state, // modify state passed through the array branch
  orx?: (x: state) => state, // likewise for or branch
  andx?: (x: state) => state, // likewise for and branch
): (input: PrerequisiteRule, state_var: state) => out {
  // state mutators default to identity if not specified
  const rx_state = arrx || ((p: state) => p);
  const ox_state = orx || ((p: state) => p);
  const ax_state = andx || ((p: state) => p);
  // the actual function
  const fn = (input: PrerequisiteRule, state_var: state): out => {
    if (isOrRule(input)) {
      const arr_out = arrl(
        input.or.map((value, i) => fn(value, rx_state(ox_state(state_var), i))),
      );
      return orl(arr_out);
    }
    if (isAndRule(input)) {
      const arr_out = arrl(
        input.and.map((value, i) =>
          fn(value, rx_state(ax_state(state_var), i)),
        ),
      );
      return andl(arr_out);
    }
    if (typeof input === "string") {
      return crsl(uid_get(input, honor_reqs), state_var);
    }
    return empty_default; // prereq was an empty object
  };
  return fn;
}

/** legacy -- strongly @deprecated Accessor factory */
function Accessor(subject: string) {
  if (!subjects.includes(subject)) {
    throw Error(`Invalid subject "${subject}" passed to Access module!`);
  }
  const uidmap: UidMap = maps[subject];
  const numbers: readonly string[] = Object.keys(uidmap);
  const general: readonly Course[] = Object.values(uidmap).map((uid) =>
    uid_get(uid, false),
  );
  const honors: readonly Course[] = Object.values(uidmap).map((uid) =>
    uid_get(uid, true),
  );
  function getTargets(prereq: Course, honor?: boolean) {
    const courses = honor ? honors : general;
    return courses.filter((target) => isPrereq(prereq, target));
  }
  function isPrereq(course: Course, target: Course, honor?: boolean): boolean {
    return PrerequisiteTraversal(
      (bools: boolean[]) => bools.some((t) => t === true),
      (a, b) => a === b, // string equality to compare uids
      (arg: boolean) => arg, // do nothing
      (arg: boolean) => arg, // do nothing
      false,
      honor,
    )(target.prereq, course);
  }
  function getCourse(subj: string, num: string, honor?: boolean) {
    if (subj != subject) {
      throw Error(`We do not have access to ${subj} courses!`);
    }
    const courses = honor ? honors : general;
    const out = courses.find((c) => c.number === num);
    if (!out) {
      throw Error(`${subj} ${num} does not exist!`);
    }
    return out;
  }
  return {
    numbers,
    general,
    honors,
    getTargets,
    isPrereq,
    getCourse,
  };
}
