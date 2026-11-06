(function () {
  const normalize = text => text.normalize('NFKC').toLocaleLowerCase().trim();
  const matches = (text, query) => query.split(/\s+/).every(term => normalize(text).includes(term));
  window.RM_API_GUIDE = {
    updateToc(active, chapter, headings) {
      const visibleHeading = headings.slice(0, headings.indexOf(active) + 1).reverse().find(h => h.tagName === 'H2' || h.tagName === 'H3');
      const id = visibleHeading.id;
      document.querySelectorAll('[data-api-toc]').forEach(toc => {
        if (toc.closest('[data-lang-pane]').hidden) return;
        if (toc.querySelector('input').value.trim()) return;
        const group = [...toc.querySelectorAll('[data-toc-chapter]')].find(g => g.dataset.tocChapter === chapter.id);
        if (!group.classList.contains('is-current')) {
          toc.querySelectorAll('details').forEach(g => { g.open = g === group; });
          toc.querySelectorAll('.is-current').forEach(g => g.classList.remove('is-current'));
          group.classList.add('is-current');
        }
        const link = toc.querySelector(`[data-toc-target="${id}"]`);
        toc.querySelectorAll('[data-toc-target]').forEach(a => a.classList.toggle('active', a === link));
        const rail = toc.closest('.guide-toc');
        if (group.open && rail && rail.clientHeight) {
          const box = rail.getBoundingClientRect(), item = link.getBoundingClientRect();
          if (item.top < box.top + 40) rail.scrollTop += item.top - box.top - 40;
          else if (item.bottom > box.bottom - 16) rail.scrollTop += item.bottom - box.bottom + 16;
        }
      });
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-api-locator]').forEach(index => {
      const input = index.querySelector('[data-api-filter]');
      let saved;
      input.addEventListener('input', () => {
        const query = normalize(input.value);
        const groups = [...index.querySelectorAll('details')];
        if (query && !saved) saved = groups.map(g => g.open);
        let total = 0;
        groups.forEach((group, i) => {
          let count = 0;
          group.querySelectorAll('[data-api-entry]').forEach(row => {
            const show = !query || matches(row.textContent, query);
            row.hidden = !show;
            if (show) count++;
          });
          group.hidden = !count;
          group.querySelector('[data-api-group-count]').textContent = count;
          if (query) group.open = count > 0;
          else if (saved) group.open = saved[i];
          total += count;
        });
        index.querySelector('[data-api-filter-status]').textContent = total ? index.dataset.countLabel.replace('{n}',total) : index.dataset.emptyLabel;
        if (!query) saved = undefined;
      });
    });
    document.querySelectorAll('[data-api-toc]').forEach(toc => {
      const input = toc.querySelector('input');
      let saved;
      input.addEventListener('input', () => {
        const query = normalize(input.value), groups = [...toc.querySelectorAll('details')];
        if (query && !saved) saved = groups.map(g => g.open);
        let count = 0;
        groups.forEach((group, i) => {
          const title = group.querySelector('summary').textContent;
          const groupMatch = !query || matches(title,query);
          let children = 0;
          group.querySelectorAll('a').forEach(link => {
            link.hidden = !(groupMatch || matches(link.textContent,query));
            if (!link.hidden) children++;
          });
          group.hidden = !children;
          if (query) group.open = children > 0;
          else if (saved) group.open = saved[i];
          if (!group.hidden) count++;
        });
        toc.querySelector('[data-api-toc-empty]').hidden = count > 0;
        if (!query) saved = undefined;
      });
    });
  });
})();
