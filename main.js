var globalPosts = [];
var globalAuthors = [];
const BASE_URL = "http://localhost:3000";

async function LoadSync() {
    try {
        let postRes = await fetch(`${BASE_URL}/posts`);
        let authorRes = await fetch(`${BASE_URL}/authors`);

        if (!postRes.ok || !authorRes.ok) throw new Error("Lỗi tải dữ liệu từ server");

        globalPosts = await postRes.json();
        globalAuthors = await authorRes.json();

        globalAuthors = globalAuthors.map(author => ({
            ...author,
            postCount: globalPosts.filter(post => post.author === author.name).length
        }));

        RenderPosts();
        RenderAuthors();
        PopulateAuthorDropdown();
    } catch (error) {
        console.error("Lỗi tải dữ liệu:", error);
    }
}

function RenderPosts() {
    let body = document.getElementById("postBody");
    body.innerHTML = globalPosts.map(ConvertPostToHTML).join("");
}

function RenderAuthors() {
    let body = document.getElementById("authorBody");
    body.innerHTML = globalAuthors.map(ConvertAuthorToHTML).join("");
}

function PopulateAuthorDropdown() {
    let authorDropdown = document.getElementById("postAuthor");
    authorDropdown.innerHTML = globalAuthors.map(author =>
        `<option value="${author.name}">${author.name}</option>`
    ).join("");
}

function checkExist(collection, id) {
    return collection.some(e => e.id == id);
}

async function SavePost() {
    let id = document.getElementById("postId").value;
    let authorName = document.getElementById("postAuthor").value;
    let obj = {
        id: id || getMaxId(globalPosts).toString(),
        title: document.getElementById("postTitle").value,
        views: document.getElementById("postViews").value,
        author: authorName,
        isPublished: document.getElementById("postPublished").checked
    };

    try {
        let method = id && checkExist(globalPosts, id) ? 'PUT' : 'POST';
        let url = id ? `${BASE_URL}/posts/${id}` : `${BASE_URL}/posts`;

        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });

        await LoadSync();
    } catch (error) {
        console.error("Lỗi khi lưu bài viết:", error);
    }
}

async function DeletePost(id) {
    try {
        await fetch(`${BASE_URL}/posts/${id}`, { method: 'DELETE' });
        await LoadSync();
    } catch (error) {
        console.error("Lỗi khi xóa bài viết:", error);
    }
}

function EditPost(id) {
    let post = globalPosts.find(p => p.id == id);
    if (!post) return;

    document.getElementById("postId").value = post.id;
    document.getElementById("postTitle").value = post.title;
    document.getElementById("postViews").value = post.views;
    document.getElementById("postAuthor").value = post.author;
    document.getElementById("postPublished").checked = post.isPublished;
}

async function SaveAuthor() {
    let id = document.getElementById("authorId").value;
    let obj = {
        id: id || getMaxId(globalAuthors).toString(),
        name: document.getElementById("authorName").value
    };

    try {
        let method = id && checkExist(globalAuthors, id) ? 'PUT' : 'POST';
        let url = id ? `${BASE_URL}/authors/${id}` : `${BASE_URL}/authors`;

        await fetch(url, {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        });

        await LoadSync();
    } catch (error) {
        console.error("Lỗi khi lưu tác giả:", error);
    }
}

async function DeleteAuthor(id) {
    try {
        await fetch(`${BASE_URL}/authors/${id}`, { method: 'DELETE' });
        await LoadSync();
    } catch (error) {
        console.error("Lỗi khi xóa tác giả:", error);
    }
}

function EditAuthor(id) {
    let author = globalAuthors.find(a => a.id == id);
    if (!author) {
        console.error("Không tìm thấy tác giả với ID:", id);
        return;
    }

    console.log("Chỉnh sửa tác giả:", author);

    document.getElementById("authorId").value = author.id;
    document.getElementById("authorName").value = author.name;
}

function ConvertPostToHTML(post) {
    return `<tr>
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.views}</td>
                <td>${post.author}</td>
                <td>${post.isPublished ? "✅" : "❌"}</td>
                <td>
                    <button onclick="EditPost(${post.id})">Edit</button>
                    <button onclick="DeletePost(${post.id})">Delete</button>
                </td>
            </tr>`;
}

function ConvertAuthorToHTML(author) {
    return `<tr>
                <td>${author.id}</td>
                <td>${author.name}</td>
                <td>${globalPosts.filter(post => post.author === author.name).length}</td>
                <td>
                    <button onclick="EditAuthor(${author.id})">Edit</button>
                    <button onclick="DeleteAuthor(${author.id})">Delete</button>
                </td>
            </tr>`;
}

function getMaxId(collection) {
    return collection.length > 0 ? Math.max(...collection.map(e => Number(e.id))) + 1 : 1;
}

document.addEventListener("DOMContentLoaded", LoadSync);
