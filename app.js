window.addEventListener("load", () => {
  const params = new URL(document.location).searchParams;
  const username = params.get("username");

  fetchUserProfile(username);
});

const baseUrl = "https://api.github.com/graphql";

const headers = {
  "Content-Type": "application/json",
  Authorization: "bearer " + `${token}`,
};

const fetchUserProfile = async (username) => {
  const query_user_profile = {
    query: `
    {
      user(login: "${username}"){
      bio,
      name,
      login,
      avatarUrl
      starredRepositories {
        totalCount
      }
      followers{
        totalCount
      }
      following {
        totalCount
      }
      
      repositories(last: 20,) {
        totalCount,
        nodes {
          description
          name
          stargazerCount
          forkCount
          primaryLanguage {
            id
            name
            color
          }
          updatedAt
        }
      }
    }
  }
    `,
  };

  try {
    document.querySelector(".content").style.display = "none";
    document.querySelector(".loader").style.display = "block";
    const res = await fetch(baseUrl, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(query_user_profile),
    });

    const { data } = await res.json();

    document.querySelector(".content").style.display = "flex";
    document.querySelector(".loader").style.display = "none";

    if (data && data?.user !== null) {
      const today = new Date();

      const reposContent = data?.user?.repositories.nodes
        .map((repo) => {
          return `
      <div class="content__repos-card--container">
      <div class="content__repos-card">
        <div class="content__repos-card--details">
          <div class="content__repos-card--header">
          <a href="#">${repo.name || ""}</a>
          <div class="content__repos-card--actions">
          <button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 18"
              width="18"
              height="18"
            >
          <path
            fill-rule="evenodd"
            d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
          ></path>
          </svg>
          Star
        </button>
        </div>
        </div>
        <p>${repo.description || ""}</p>
          <div class="stats">
            <div class="lang">
              <span class="lang__color" style="background-color: ${
                repo.primaryLanguage?.color ?? "red"
              }"></span>
              <p>${repo.primaryLanguage?.name ?? "Multiple"}</p>
            </div>
            <div class="stargazers">
            <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 18 18"
            width="18"
            height="18"
          >
            <path
              fill-rule="evenodd"
              d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
            ></path>
          </svg>
            <p>${repo.stargazerCount}</p>
            </div>
            <div class="stargazers">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="16" height="16"><path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path></svg>
            <p>${repo.forkCount}</p>
            </div>

           
            <p>Updated ${moment(repo.updatedAt).from(moment(today))}</p>
          </div>
        </div>
       
      </div>
      <div class="seperator"></div>
    </div>
      `;
        })
        .join("");

      const profileContent = `
        <div class="content__profile-description--name">
        <p>${data.user.name}</p>
        <p>${data.user.login}</p>
      </div>
      <div class="content__profile-description--about">
        <p class="intro">${data.user.bio || ""}</p>
        <hr />
        <div class="stats">
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 18"
              width="18"
              height="18"
            >
              <path
                fill-rule="evenodd"
                d="M5.5 3.5a2 2 0 100 4 2 2 0 000-4zM2 5.5a3.5 3.5 0 115.898 2.549 5.507 5.507 0 013.034 4.084.75.75 0 11-1.482.235 4.001 4.001 0 00-7.9 0 .75.75 0 01-1.482-.236A5.507 5.507 0 013.102 8.05 3.49 3.49 0 012 5.5zM11 4a.75.75 0 100 1.5 1.5 1.5 0 01.666 2.844.75.75 0 00-.416.672v.352a.75.75 0 00.574.73c1.2.289 2.162 1.2 2.522 2.372a.75.75 0 101.434-.44 5.01 5.01 0 00-2.56-3.012A3 3 0 0011 4z"
              ></path>
            </svg>
            <p><strong>${data.user.followers.totalCount}</strong> Followers</p>
          </div>
          <div>
            <p><strong>${data.user.following.totalCount}</strong> Following</p>
          </div>
          <div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 18 18"
              width="18"
              height="18"
            >
              <path
                fill-rule="evenodd"
                d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z"
              ></path>
            </svg>
            <p>${data.user.starredRepositories.totalCount}</p>
          </div>
        </div>
      </div>
        `;

      document.querySelector("#repos__count").innerText =
        data.user.repositories.totalCount;

      document.querySelector(".content__repos-container").innerHTML =
        reposContent;
      document.querySelector(".content__profile-description").innerHTML =
        profileContent;

      const avatar = document.querySelector(".avatar__img");
      const headerAvatar = document.querySelector(".header__avatar>img");
      data.user.avatarUrl &&
        headerAvatar.setAttribute("src", data.user.avatarUrl);
      avatar.setAttribute("src", data.user.avatarUrl);
    }
    if (data.user === null) {
      document.querySelector(".content").style.display = "none";
      document.querySelector(".error").style.display = "block";
    }
  } catch (error) {
    console.log("error", error);
  }
};
