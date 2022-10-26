// ==UserScript==
// @name VGMdb Covers Downloader
// @namespace https://github.com/take-kun
// @version 0.1.0
// @description Tool for automatically downloading all covers available for the release on VGMdb.net
// @author Take-kun
// @license MIT
// @match https://vgmdb.net/album/*
// @connect media.vgm.io
// @grant GM_xmlhttpRequest
// ==/UserScript==

'use strict';

(() => {
    const loggedIn = document.querySelector('#navmember');

    if (!loggedIn) {
        return;
    }

    const getDLButton = () => {
        const temp = document.createElement('template');
        temp.innerHTML = '<img src="/db/img/arrowbit.gif" class="inlineimg" height="12px" width="12px" style="rotate: 90deg;" /> <a href=""><b>Download all</b></a><br />'

        return temp;
    };

    const links = document.querySelectorAll('#cover_list a').values();

    const dl = document.createElement('div');
    dl.append(getDLButton().content);
    dl.onclick = (e) => {
        e.preventDefault();
        [...links].forEach((l, i) => {
            fetch(l.href)
                .then(res => res.text())
                .then(html => {
                    const parser = new DOMParser();
                    const htmlDOM = parser.parseFromString(html, "text/html");
                    return htmlDOM.querySelector('#scrollpic').src;
                })
                .then(src => GM_xmlhttpRequest({
                    url: src,
                    responseType: 'blob',
                    onload: ({response}) => {
                        const url = URL.createObjectURL(response);
                        const link = document.createElement('a');
                        link.href = url;
                        link.download = l.text;
                        document.body.appendChild(link);
                        link.click();
                        setTimeout(() => {
                            document.body.removeChild(link);
                            URL.revokeObjectURL(url);
                        }, 0);
                    },
                }));
        })
    };

    const coversListEl = document.querySelector('#cover_list');
    coversListEl.prepend(dl);
})();