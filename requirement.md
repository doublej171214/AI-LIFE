## 项目名称

微信小程序 - 生物节律与待办事项分析

## 项目概述

该小程序旨在通过用户输入的生日计算生物节律，并结合AI分析用户的待办事项，提供个性化的建议和决策支持。

## 功能需求

### 1. 登录页面

- **隐私政策按钮**：
  - 点击后显示隐私政策内容。
  - 用户可以查看应用的隐私政策和数据使用条款。

- **继续按钮**：
  - 点击后进入主页面。
  - 用户确认同意隐私政策后才能继续使用应用。

### 2. 生物节律计算

- **输入生日**：用户可以选择自己的生日。
- **计算生物节律**：
  - 体力周期：23天
  - 情绪周期：28天
  - 智力周期：33天
- **显示结果**：根据计算公式显示用户的生物节律状态。

### 3. 待办事项与AI分析

- **输入待办事项**：用户可以输入当天的待办事项。
- **AI分析**：调用AI模型（如豆包）根据生物节律对待办事项进行分析和建议。

## 用户界面

### 主页面

- **出生日期按钮**：选择生日并显示生物节律。
- **制定今日任务按钮**：输入待办事项，点击"AI评估"进行分析。

## 计算公式

- **总生活天数计算**：
  \[
  X = 365 \times A \pm B + C
  \]
  - \( A \) 为年份差
  - \( B \) 为本年生日到预测日的天数
  - \( C \) 为闰年数

- **周期计算**：
  - 体力周期：\( X \mod 23 \)
  - 情绪周期：\( X \mod 28 \)
  - 智力周期：\( X \mod 33 \)

## 目标用户

- 需要了解自身生物节律的用户
- 希望通过AI分析优化待办事项的用户
