import com.android.build.api.dsl.ApplicationExtension
import org.jlleitschuh.gradle.ktlint.KtlintExtension

plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.kotlin.serialization) apply false
    alias(libs.plugins.ksp) apply false
    alias(libs.plugins.hilt) apply false
    alias(libs.plugins.apollo) apply false
    alias(libs.plugins.ktlint)
}

configure<KtlintExtension> {
    version.set("1.8.0")
}

subprojects {
    plugins.withId("org.jlleitschuh.gradle.ktlint") {
        extensions.configure<KtlintExtension> {
            version.set("1.8.0")
            baseline.set(rootProject.file("app/ktlint-baseline.xml"))
        }
    }

    plugins.withId("com.android.application") {
        tasks.named("check").configure {
            dependsOn("ktlintCheck")
        }

        extensions.configure<ApplicationExtension>("android") {
            lint {
                abortOnError = false
                checkDependencies = true
                checkReleaseBuilds = true
                lintConfig = file("lint.xml")
                baseline = file("lint-baseline.xml")
            }
        }
    }
}

data class ReleaseCommit(
    val type: String,
    val scope: String?,
    val description: String,
    val hash: String,
)

fun gitOutput(command: List<String>): String {
    val process = ProcessBuilder(command).redirectErrorStream(true).start()
    val output = process.inputStream.bufferedReader().use { it.readText() }
    val exitCode = process.waitFor()
    if (exitCode != 0) {
        throw GradleException("Command failed: ${command.joinToString(" ")}\n$output")
    }
    return output
}

fun collectCommits(
    fromTag: String,
    toRevision: String,
): List<ReleaseCommit> {
    val pattern = Regex("^(feat|fix)(?:\\(([^)]*)\\))?!?:\\s*(.+)$")
    return gitOutput(
        listOf("git", "log", "--no-merges", "--format=%H%x09%s", "$fromTag..$toRevision"),
    ).lineSequence()
        .map(String::trim)
        .filter(String::isNotEmpty)
        .mapNotNull { line ->
            val (hash, subject) = line.split('\t', limit = 2).takeIf { it.size == 2 } ?: return@mapNotNull null
            val match = pattern.matchEntire(subject) ?: return@mapNotNull null
            ReleaseCommit(
                type = match.groupValues[1],
                scope = match.groupValues[2].ifEmpty { null },
                description = match.groupValues[3].trim(),
                hash = hash,
            )
        }.toList()
}

fun commitBullet(
    commit: ReleaseCommit,
    withLink: Boolean,
): String {
    val scope = commit.scope?.let { "**$it** " }.orEmpty()
    val link =
        if (withLink) {
            " ([${commit.hash.take(15)}](https://github.com/ffalt/starfield/commit/${commit.hash}))"
        } else {
            ""
        }
    return " - $scope${commit.description}$link"
}

fun commitSections(
    commits: List<ReleaseCommit>,
    heading: String,
    withLinks: Boolean,
): String =
    buildString {
        listOf("feat" to "Features", "fix" to "Bug Fixes").forEach { (type, title) ->
            val selected = commits.filter { it.type == type }
            if (selected.isNotEmpty()) {
                append("$heading $title\n\n")
                selected.forEach { append(commitBullet(it, withLinks)).append('\n') }
                append('\n')
            }
        }
    }

fun calculateAndroidVersionCode(versionName: String): Int {
    val parts = versionName.removePrefix("v").split('.')
    val (major, minor, patch, build) = (0..3).map { parts.getOrNull(it)?.toIntOrNull() ?: 0 }
    return (major * 1000 * 1000 * 1000) + (minor * 1000 * 1000) + (patch * 1000) + build
}

fun findPreviousReleaseTag(version: String): String {
    val versionCode = calculateAndroidVersionCode(version)
    val previousTag =
        gitOutput(listOf("git", "tag", "--list", "v*"))
            .lineSequence()
            .map(String::trim)
            .filter { Regex("v\\d+(\\.\\d+)*").matches(it) }
            .filter { calculateAndroidVersionCode(it) < versionCode }
            .maxByOrNull(::calculateAndroidVersionCode)
            ?: throw GradleException(
                "No release tag below $version found. Cannot determine the changelog range.",
            )
    return previousTag
}

tasks.register("gitReleaseNotesTask") {
    description = "Generate release notes for the current version based on git commits since the previous release tag."
    val releaseVersion = project.version.toString()
    val repositoryDirectory = rootDir

    doLast {
        fun gitOutput(command: List<String>): String {
            val process =
                ProcessBuilder(command)
                    .directory(repositoryDirectory)
                    .redirectErrorStream(true)
                    .start()
            val output = process.inputStream.bufferedReader().use { it.readText() }
            val exitCode = process.waitFor()
            if (exitCode != 0) {
                throw GradleException("Command failed: ${command.joinToString(" ")}\n$output")
            }
            return output
        }

        fun calculateVersionCodeForTask(version: String): Int {
            val parts = version.removePrefix("v").split('.')
            val (major, minor, patch, build) =
                (0..3).map { parts.getOrNull(it)?.toIntOrNull() ?: 0 }
            return (major * 1000 * 1000 * 1000) + (minor * 1000 * 1000) + (patch * 1000) + build
        }

        val currentVersionCode = calculateVersionCodeForTask(releaseVersion)
        val previousTag =
            gitOutput(listOf("git", "tag", "--list", "v*"))
                .lineSequence()
                .map(String::trim)
                .filter { Regex("v\\d+(\\.\\d+)*").matches(it) }
                .filter { calculateVersionCodeForTask(it) < currentVersionCode }
                .maxByOrNull(::calculateVersionCodeForTask)
                ?: throw GradleException(
                    "No release tag below $releaseVersion found. Cannot determine the changelog range.",
                )

        // The release tag only exists once the release is tagged, so fall back to HEAD before that.
        val toRevision =
            listOf(releaseVersion, "v${releaseVersion.removePrefix("v")}", "HEAD").first { revision ->
                runCatching { gitOutput(listOf("git", "rev-parse", "--verify", "--quiet", "$revision^{commit}")) }.isSuccess
            }
        println("Generating Release notes for $releaseVersion ($toRevision) compared to $previousTag")

        val pattern = Regex("^(feat|fix)(?:\\(([^)]*)\\))?!?:\\s*(.+)$")
        val commits =
            gitOutput(
                listOf("git", "log", "--no-merges", "--format=%H%x09%s", "$previousTag..$toRevision"),
            ).lineSequence()
                .map(String::trim)
                .filter(String::isNotEmpty)
                .mapNotNull { line ->
                    val (hash, subject) =
                        line.split('\t', limit = 2).takeIf { it.size == 2 } ?: return@mapNotNull null
                    val match = pattern.matchEntire(subject) ?: return@mapNotNull null
                    ReleaseCommit(
                        type = match.groupValues[1],
                        scope = match.groupValues[2].ifEmpty { null },
                        description = match.groupValues[3].trim(),
                        hash = hash,
                    )
                }.toList()

        val sections =
            buildString {
                listOf("feat" to "Features", "fix" to "Bug Fixes").forEach { (type, title) ->
                    val selected = commits.filter { it.type == type }
                    if (selected.isNotEmpty()) {
                        append("## $title\n\n")
                        selected.forEach { commit ->
                            val scope = commit.scope?.let { "**$it** " }.orEmpty()
                            append(" - $scope${commit.description} ([${commit.hash.take(15)}]")
                                .append("(https://github.com/ffalt/starfield/commit/${commit.hash}))\n")
                        }
                        append('\n')
                    }
                }
            }
        repositoryDirectory.resolve("RELEASE_NOTES.md").writeText(
            sections +
                "## Full Changelog\n\nhttps://github.com/ffalt/starfield/compare/$previousTag...$releaseVersion\n",
        )
    }
}

tasks.register("gitChangelogTask") {
    description = "Generate changelog for the current version based on git commits since the previous release tag."
    doLast {
        // Prepend only the new changes since the previous release to the top of CHANGELOG.md.
        val version = project.version.toString()
        val previousTag = findPreviousReleaseTag(version)
        val commits = collectCommits(previousTag, version)
        val tagDate = gitOutput(listOf("git", "log", "-1", "--format=%cs", version)).trim()
        val entry =
            "## [$version](https://github.com/ffalt/starfield/compare/$previousTag...$version) ($tagDate)\n\n" +
                commitSections(commits, "###", true)

        val changelogFile = rootDir.resolve("CHANGELOG.md")
        val existing =
            if (changelogFile.exists()) {
                changelogFile.readText().replaceFirst(Regex("^\\s+"), "")
            } else {
                ""
            }
        changelogFile.writeText(entry + existing)
    }
}

tasks.register("bumpReleaseVersion") {
    description = "Bump the version in gradle.properties to the next patch version and commit the change."
    doLast {
        val isClean = gitOutput(listOf("git", "status", "--porcelain")).trim().isEmpty()
        if (!isClean) {
            throw GradleException("Git repository is dirty. Commit your changes first!")
        }

        val parts =
            project.version
                .toString()
                .removePrefix("v")
                .split('.')
        val (major, minor, patch) = (0..2).map { parts.getOrNull(it)?.toIntOrNull() ?: 0 }
        val nextVersion = "v$major.$minor.${patch + 1}"

        println("Bumping ${project.version} => $nextVersion")

        val propertiesFile = rootDir.resolve("gradle.properties")
        propertiesFile.writeText(propertiesFile.readText().replace(project.version.toString(), nextVersion))

        gitOutput(listOf("git", "add", "gradle.properties"))
        gitOutput(listOf("git", "commit", "-m", "Bump version to $nextVersion"))
        gitOutput(listOf("git", "commit", "--amend", "--no-edit", "--allow-empty", "-s"))
    }
}

tasks.register("prepareReleaseTag") {
    description = "Prepare a temporary release tag for the current version. This is used to generate changelogs and F-Droid metadata."
    doLast {
        val version = project.version.toString()
        println("Adding temp tag $version")
        gitOutput(listOf("git", "tag", version))
    }
}

tasks.register("release") {
    description = "Release the current version by creating a git tag and committing the changelog."
    dependsOn(
        tasks.named("prepareReleaseTag"),
        tasks.named("gitChangelogTask"),
        tasks.named("gitFdroidChangelogTask"),
    )

    doLast {
        val version = project.version.toString()
        println("Releasing $version")
        gitOutput(listOf("git", "tag", "-d", version))

        val versionCode = calculateAndroidVersionCode(version)
        val fdroidRelativePath = "fastlane/metadata/android/en-US/changelogs/$versionCode.txt"
        val fdroidFile = file(fdroidRelativePath)
        if (!fdroidFile.exists() || fdroidFile.readText().trim().isEmpty()) {
            throw GradleException(
                "No changelog entries generated for $version " +
                    "($fdroidRelativePath is empty). Restore the working tree and verify the previous release tag.",
            )
        }
        println("Adding F-Droid changelog $fdroidRelativePath to git")
        gitOutput(listOf("git", "add", fdroidRelativePath))
        gitOutput(listOf("git", "commit", "-a", "-m", "Release $version"))
        gitOutput(listOf("git", "commit", "--amend", "--no-edit", "--allow-empty", "-s"))
        gitOutput(listOf("git", "tag", version))
        println("To publish the commit and tag: git push --atomic origin main $version")
    }
}

tasks.register("gitFdroidChangelogTask") {
    description = "Generate F-Droid changelog for the current version based on git commits since the previous release tag."
    doLast {
        val version = project.version.toString()
        println("Update Fdroid changelogs $version")
        val previousTag = findPreviousReleaseTag(version)
        val commits = collectCommits(previousTag, version)
        val versionCode = calculateAndroidVersionCode(version)
        val target = rootDir.resolve("fastlane/metadata/android/en-US/changelogs/$versionCode.txt")
        target.writeText(commits.joinToString("\n") { commitBullet(it, false) } + "\n")
    }
}

tasks.named("gitChangelogTask").configure {
    mustRunAfter(tasks.named("prepareReleaseTag"))
}
tasks.named("gitFdroidChangelogTask").configure {
    mustRunAfter(tasks.named("prepareReleaseTag"))
}
