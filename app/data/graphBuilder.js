import Access from "./access"

const use_elk = true;
const graph_config = (use_elk
  ? '---\nconfig:\n flowchart:\n  defaultRenderer: elk\n theme: dark\n themeVariables:\n  primaryColor: "#00ff00"\n---\n'
  : '---\nconfig:\n theme: dark\n themeVariables:\n  primaryColor: "#00ff00"\n---\n'
);

// DOES NOT RECURSIVELY BUILD YET (only traverses one level back)
export function buildCombinedGraph(courses) {
    function helper (subj, idnum) {
        function process (preqs, target) {
            if (!preqs) return ''

            if (preqs.and) return process(preqs.and, target)
            if (preqs.or) return process(preqs.or, target)
            if (preqs.code) return `${preqs.subject}_${preqs.id}[${preqs.code}]\n${preqs.subject}_${preqs.id} --> ${target}\n`

            let proc = ''
            for (j = 0; j < preqs.length; j++) { proc += process(preqs[j], target) }
            return proc
        }  // end of process

        if (course_dupes.includes(`${subj} ${idnum}`)) { return '' }  // early exit for duplicates

        console.log(':', subj, idnum)
        course_dupes.push(`${subj} ${idnum}`)
        let build = `${subj}_${idnum}[${subj} ${idnum}]\n`

        if (idnum < "1000") { return build }  // early exit for 0xxx-level courses

        let prereqs = accs.get(subj).getPrereq("code", `${subj} ${idnum}`)
        return build + process(prereqs, `${subj}_${idnum}`)
    }  // end of build_helper

    console.log("buildgraph:", courses)
    if (courses.length == 0) { console.log("WARNING: no courses passed in, built empty graph.") }

    const accs = Map()  // add Access(subject) as they are made, reuse them when possible
    let course_dupes = []
    let graph = ''

    for (var k = 0; k < courses.length; k++) {
        console.log('>', courses[k])
        let [subjcode, coursenum] = courses[k].split(' ', 2)
        if (!accs.has(subjcode)) { accs.set(subjcode, Access(subjcode)) }
        coursenum = accs.get(subjcode).getId("id", coursenum)  // reassigned just in case there's a slight discrepancy between input and data
        graph = graph.concat( helper(subjcode, coursenum) )
    }

    return graph_config + "graph TD\n" + graph
}

// DOES NOT RECURSIVELY BUILD YET (only traverses one level back)
export function buildGraph(course) {
    return buildCombinedGraph([course])
}
