function createEl (tag, className) {
    const el = document.createElement(tag);
    if (className) el.classList.add(className);
    return el;
}

function debounce (fn, debounceTime) {
    let time;
    return function() {
        clearTimeout(time);
        time = setTimeout(() => {
            fn.apply(this);
        }, debounceTime)
    }
};

function clear () {
    while (repoList.firstChild) {
        repoList.removeChild(repoList.firstChild);
    }
}


async function searchRepo () {
    await fetch(`https://api.github.com/search/repositories?q=${input.value}&per_page=5`).then(result => {
        if(result.ok) {
            result.json()
            .then(repo => repo.items)
            .then(repoArr => {
                const arr = [];
                repoArr.forEach(el => {
                    arr.push({
                        'name': el.name,
                        'own': el.owner.login,
                        'stars': el.stargazers_count
                    })
                });
                return arr;
            })
            .then(arr => {
                let fragment = document.createDocumentFragment();

                arr.forEach(el => {
                    const searchResult = createEl('li', 'searchList');
                    const span = createEl('span');
                    span.textContent = el.name;
                    searchResult.appendChild(span);

                    searchResult.addEventListener('click', () => {

                        //по клику добавление
                        if (acc < 3) {
                            acc++
                            const addedElement = createEl('div', 'addedElement');

                            const elemName = createEl('li');
                            elemName.textContent = `name: ${el.name}`;
                            addedElement.appendChild(elemName);
                            const elemOwner = createEl('li');
                            elemOwner.textContent = `Owner: ${el.own}`;
                            addedElement.appendChild(elemOwner);
                            const elemStars = createEl('li');
                            elemStars.textContent = `Stars: ${el.stars}`;
                            addedElement.appendChild(elemStars);

                            //Кнопка удалить
                            const close = createEl('div', 'close');
                            close.addEventListener('click', () => {
                                if (acc == 3) full.remove();
                                acc = acc - 1;
                                close.parentNode.remove();
                            });
                            addedElement.appendChild(close);

                            if (acc == 3) wrapper.append(full);

                            //Добавляем в стэк
                            addedRepo.appendChild(addedElement);
                            input.value = '';
                            clear();
                        }                        
                    })

                    fragment.appendChild(searchResult);
                })
                return fragment;
            })
            .then(fragment => {
                clear();
                repoList.appendChild(fragment)
            })
        }
    })
}



let acc = 0;
const app = document.getElementById('app');

const wrapper = createEl('div', 'wrapper');
const input = createEl('input', 'search-input');
const repoList = createEl('div', 'repoList');
const addedRepo = createEl('div', 'addedRepo');
const full = createEl('p', 'fullStack')
full.textContent = 'Список полон!'

wrapper.append(input);
wrapper.append(repoList);
wrapper.append(addedRepo);
app.append(wrapper)



input.addEventListener('keyup', debounce(searchRepo, 500))