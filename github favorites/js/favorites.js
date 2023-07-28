import { GithubUser } from "./githubuser.js";

export class Favorites {
    constructor(root){
        this.root = document.querySelector(root);
        this.load();
    };
    async add(username){
        try {
            const userExists = this.entries.find(entry => entry.login === username);
            if(userExists){
                throw new Error(`Usúario ${username} já está cadastrado`);
            };

            const user = await GithubUser.search(username);
            if (user.login === undefined) {
                throw new Error(`Usuário não encontrado`);
            }
            this.entries = [user, ...this.entries];
            this.update();
            this.save();
        } catch (error) {
            alert(error.message);
        };
    };
    load(){
        this.entries = JSON.parse(localStorage.getItem(`@github-favorites:`)) || [];
    };
    delete(user){
        const filteredEntries = this.entries
        .filter(entry => entry.login !== user.login);
        this.entries = filteredEntries;
        this.update();
        this.save();
    };
    save(){
        localStorage.setItem(`@github-favorites:`, JSON.stringify(this.entries));
    };
};
export class FavoritesView extends Favorites {
    constructor(root){
        super(root);
        this.tbody = this.root.querySelector('table tbody');
        this.update();
        this.onadd();

    };
    update(){
        this.removeAllTr();
        this.noFavoritesYet();
        this.entries.forEach(user => {
            const row = this.createRow();
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
            row.querySelector('.user img').alt = `Imagem de ${user.name}`;
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name;
            row.querySelector('.user span').textContent = user.login;
            row.querySelector('.repositories').textContent = user.public_repos;
            row.querySelector('.followers').textContent = user.followers;
            row.querySelector('.action').onclick = () => {
            const isOk = confirm(`Tem certeza que quer deletar esta linha?`);
                if(isOk) {
                   this.delete(user);
                };
            };
            this.tbody.append(row);
        });
    };
    removeAllTr(){
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove();
        });
    };
    createRow(){
        const tr = document.createElement('tr');
        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/maykbrito.png" alt="Imagem de Mayk Brito">
            <a href="https://github.com/maykbrito" target="_blank">
                <p>Mayk Brito</p>
                <span>maykbrito</span>
            </a>
        </td>
        <td class="repositories">
            76
        </td>
        <td class="followers">
            9589
        </td>
        <td class="action">
            <button>Remove</button>
        </td>
    `
        return tr;
    };
    onadd(){
        const addButton = this.root.querySelector('.search button');
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');
            this.add(value);
        };
    };
    noFavoritesYet(){
        const noFavoritesYet = this.root.querySelector('.noFav')
        if(this.entries.length === 0){
            noFavoritesYet.classList.remove('hidden');
        } else{
            noFavoritesYet.classList.add('hidden');
        }
    }
};