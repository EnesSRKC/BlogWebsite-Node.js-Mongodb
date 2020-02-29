const moment = require('moment');


module.exports = {
    generateDate: (date, format) => {
        return moment(date).format(format);
    },
    truncate: (str, len) => {
        if (str.length > len) {
            str = str.substring(0, len) + '...';
            return str;
        }
        return str;
    },
    paginate: (options) => {
        var current = Number(options.hash.current);
        var pages = Number(options.hash.pages);
        let html = ``;

        if (options.hash.current === 1) {
            html += `<li class="page-item disabled"><a class="page-link">First</a></li>`;
        } else {
            html += `<li class="page-item"><a class="page-link" href="?page=1">First</a></li>`;
        }

        let i = (current > 3 ? current - 2 : 1);


        if (i !== 1) {
            html += `<li class="page-item disabled" ><a class="page-link">...</a></li>`;
        }

        for (; i <= current + 2 && i <= pages; i++) {
            if (i === current) {
                html += `<li class="page-item active"><a class="page-link ">${i}</a></li>`;
            } else {
                html += `<li class="page-item"><a class="page-link" href="?page=${i}">${i}</a></li>`;
            }

            if (i === current + 2 && i <= pages) {
                html += `<li class="page-item disabled" ><a class="page-link">...</a></li>`;
            }
        }

        if (current === pages) {
            html += `<li class="page-item disabled"><a class="page-link">Last</a></li>`;
        } else {
            html += `<li class="page-item"><a class="page-link" href="?page=${pages}">Last</a></li>`;
        }

        return html;
    }
}


