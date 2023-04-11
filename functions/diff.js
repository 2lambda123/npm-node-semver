const parse = require('./parse')
const eq = require('./eq')
const gt = require('./gt')

const diff = (version1, version2) => {
  const v1 = parse(version1)
  const v2 = parse(version2)
  if (eq(v1, v2)) {
    return null
  }

  const v1Higher = gt(v1, v2)
  const highVersion = v1Higher ? v1 : v2
  const lowVersion = v1Higher ? v2 : v1
  const highHasPre = !!highVersion.prerelease.length
  const lowHasPre = !!lowVersion.prerelease.length
  const prefix = highHasPre ? 'pre' : ''

  if (v1.major !== v2.major) {
    return prefix + 'major'
  }

  if (v1.minor !== v2.minor) {
    return prefix + 'minor'
  }

  if (v1.patch !== v2.patch) {
    return prefix + 'patch'
  }

  if (lowHasPre && !highHasPre) {
    if (lowVersion.patch) {
      // anything higher than a patch bump would result in the wrong version
      return 'patch'
    }

    if (lowVersion.minor) {
      // anything higher than a minor bump would result in the wrong version
      return 'minor'
    }

    // bumping major/minor/patch all have same result
    return 'major'
  }

  // at this point it must be that both are prereleases and
  // prelease parts are different because we know the 2 versions
  // are not equal
  return 'prerelease'
}
module.exports = diff
