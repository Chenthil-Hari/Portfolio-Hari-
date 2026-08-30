export interface GitHubRepo {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  topics: string[]
  updated_at: string
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=6&type=public`,
      { headers: { Accept: 'application/vnd.github.v3+json' } }
    )
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
    const data: GitHubRepo[] = await res.json()
    return data.sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 6)
  } catch (e) {
    console.error('Failed to fetch GitHub repos:', e)
    return []
  }
}

export async function fetchGitHubUser(username: string) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`)
    return res.json()
  } catch (e) {
    console.error('Failed to fetch GitHub user:', e)
    return null
  }
}
