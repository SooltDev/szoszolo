/*
    LETTER,WORD
    a,alma
    a,autó
    a,ablak
    á,ásó
    á,ágy
    b,banán
    b,bicikli
    b,bili
    c,citrom
    c,ceruza
    c,cica
    .
    .
    .
*/
const letterCSVToJSON = (csv, sep = ',', header = true, grouping = true) => {
    csv = csv.replaceAll('\r', '');

    const rows = csv.split('\n');
    const headers = rows[0].split(',');

    const object = {};

    rows.slice(1).forEach( line => {
        const row = line.split(',');
        if (!(row[0] in object))
            object[row[0]] = [];

        object[row[0]].push(row[1]);
    });

    return object;

}

const loadLetterCSV = async (url) => {
    const res = await fetch(url, {
        method: 'GET',
        headers: {
            "Content-Type": "text/csv"
        }
    });
    const data = await res.text();

    return letterCSVToJSON(data);
}

export { letterCSVToJSON, loadLetterCSV };