const { withSettingsGradle, withGradleProperties } = require('@expo/config-plugins');

const withAndroidSettingsFix = (config) => {
  // 1. settings.gradle modification
  config = withSettingsGradle(config, (config) => {
    let contents = config.modResults.contents;
    
    const startIdx = contents.indexOf('pluginManagement {');
    if (startIdx !== -1) {
      let braceCount = 0;
      let endIdx = -1;
      for (let i = startIdx; i < contents.length; i++) {
        if (contents[i] === '{') {
          braceCount++;
        } else if (contents[i] === '}') {
          braceCount--;
          if (braceCount === 0) {
            endIdx = i;
            break;
          }
        }
      }
      
      if (endIdx !== -1) {
        const robustBlock = `pluginManagement {
  def reactNativeGradlePlugin = null
  try {
    def path = providers.exec {
      workingDir(rootDir)
      commandLine("node", "--no-warnings", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })")
    }.standardOutput.asText.get().trim()
    reactNativeGradlePlugin = new File(path).getParentFile()
  } catch (Exception e) {
    println("Settings.gradle: Dynamic resolution of react-native-gradle-plugin failed: " + e.getMessage())
    reactNativeGradlePlugin = new File(rootDir, "../node_modules/@react-native/gradle-plugin")
  }
  
  if (reactNativeGradlePlugin != null && reactNativeGradlePlugin.exists()) {
    includeBuild(reactNativeGradlePlugin.absolutePath)
  } else {
    includeBuild(new File(rootDir, "../node_modules/@react-native/gradle-plugin").absolutePath)
  }
  
  def expoPluginsPath = null
  try {
    def path = new File(
      providers.exec {
        workingDir(rootDir)
        commandLine("node", "--no-warnings", "--print", "require.resolve('expo-modules-autolinking/package.json', { paths: [require.resolve('expo/package.json')] })")
      }.standardOutput.asText.get().trim(),
      "../android/expo-gradle-plugin"
    ).absolutePath
    expoPluginsPath = new File(path)
  } catch (Exception e) {
    println("Settings.gradle: Dynamic resolution of expo-gradle-plugin failed: " + e.getMessage())
    expoPluginsPath = new File(rootDir, "../node_modules/expo-modules-autolinking/android/expo-gradle-plugin")
  }
  
  if (expoPluginsPath != null && expoPluginsPath.exists()) {
    includeBuild(expoPluginsPath.absolutePath)
  } else {
    includeBuild(new File(rootDir, "../node_modules/expo-modules-autolinking/android/expo-gradle-plugin").absolutePath)
  }
}`;
        
        contents = contents.substring(0, startIdx) + robustBlock + contents.substring(endIdx + 1);
      }
    }
    
    config.modResults.contents = contents;
    return config;
  });

  // 2. gradle.properties modification (force build to run on local JDK 17 and increase AsyncStorage limit)
  config = withGradleProperties(config, (config) => {
    const javaHomeKey = 'org.gradle.java.home';
    const javaHomeVal = 'C:\\\\Program Files\\\\Java\\\\jdk-17';
    const dbSizeKey = 'AsyncStorage_db_size_in_MB';
    const dbSizeVal = '50';
    
    // Org Java Home
    const javaHomeExists = config.modResults.some(item => item.key === javaHomeKey);
    if (!javaHomeExists) {
      config.modResults.push({ key: javaHomeKey, value: javaHomeVal, type: 'property' });
    } else {
      config.modResults = config.modResults.map(item => item.key === javaHomeKey ? { ...item, value: javaHomeVal } : item);
    }

    // AsyncStorage DB size
    const dbSizeExists = config.modResults.some(item => item.key === dbSizeKey);
    if (!dbSizeExists) {
      config.modResults.push({ key: dbSizeKey, value: dbSizeVal, type: 'property' });
    } else {
      config.modResults = config.modResults.map(item => item.key === dbSizeKey ? { ...item, value: dbSizeVal } : item);
    }
    return config;
  });

  return config;
};

module.exports = withAndroidSettingsFix;
