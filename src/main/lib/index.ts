import { appDirectoryName, fileEncoding } from '@shared/constants'
import { NoteInfo } from '@shared/models'
import { CreateNote, DeleteNote, GetNotes, ReadNote, WriteNote } from '@shared/types'
import { dialog } from 'electron'
import { ensureDir, readdir, readFile, remove, stat, writeFile } from 'fs-extra'
import { homedir } from 'os'
import path from 'path'

/**
 * 获取应用程序的根目录路径
 * @returns 返回用户主目录下应用程序目录的完整路径
 */
export const getRootDir = () => {
  return `${homedir}/${appDirectoryName}`
}

/**
 * 获取所有笔记文件信息
 * @returns 返回包含所有笔记信息的Promise数组
 */
export const getNotes: GetNotes = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const notesFileNames = await readdir(rootDir, {
    encoding: fileEncoding,
    withFileTypes: false
  })

  // 过滤出所有markdown文件
  const notes = notesFileNames.filter((fileName) => fileName.endsWith('.md'))

  return Promise.all(notes.map(getNoteInfoFromFilename))
}

/**
 * 根据文件名获取笔记信息
 * @param fielname 笔记文件名
 * @returns 返回包含笔记标题和最后编辑时间的Promise
 */
export const getNoteInfoFromFilename = async (fielname: string): Promise<NoteInfo> => {
  const fileStats = await stat(`${getRootDir()}/${fielname}`)

  return {
    title: fielname.replace(/\.md$/, ''),
    lastEditTime: fileStats.mtimeMs
  }
}

export const readNote: ReadNote = async (filename: string) => {
  const rootDir = getRootDir()

  return readFile(`${rootDir}/${filename}.md`, { encoding: fileEncoding })
}

export const writeNote: WriteNote = async (filename: string, content: string) => {
  const rootDir = getRootDir()

  return writeFile(`${rootDir}/${filename}.md`, content, { encoding: fileEncoding })
}

export const createNote: CreateNote = async () => {
  const rootDir = getRootDir()

  await ensureDir(rootDir)

  const { filePath, canceled } = await dialog.showSaveDialog({
    title: 'New note',
    defaultPath: `${rootDir}/Untitled.md`,
    buttonLabel: '新建',
    showsTagField: false,
    properties: ['showOverwriteConfirmation'], // 提示覆盖
    filters: [{ name: 'Markdown', extensions: ['md'] }]
  })
  if (canceled || !filePath) {
    return false
  }

  const { name: filename, dir: parentDir } = path.parse(filePath)

  if (parentDir !== rootDir) {
    await dialog.showMessageBox({
      type: 'error',
      title: 'Creation failed',
      message: `All notes must be saved under ${rootDir}.
      Avoid using other drrectories!`
    })
    return false
  }

  await writeFile(filePath, '')

  return filename
}

export const deleteNote: DeleteNote = async (filename) => {
  const rootDir = getRootDir()

  const { response } = await dialog.showMessageBox({
    type: 'warning',
    title: '删除笔记',
    message: `你确定要删除 ${filename} 吗？`,
    buttons: ['确定', '取消'],
    defaultId: 1,
    cancelId: 1
  })
  if (response === 1) {
    return false
  }
  await remove(`${rootDir}/${filename}.md`)
  return true
}
